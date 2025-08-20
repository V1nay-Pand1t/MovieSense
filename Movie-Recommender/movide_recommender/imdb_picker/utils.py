from elasticsearch import Elasticsearch, NotFoundError, ConnectionError
from sentence_transformers import SentenceTransformer
from django.http import JsonResponse
import os
import requests


def api_error_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except NotFoundError:
            return {"error": "Not found"}
        except ConnectionError:
            return {"error": "Elasticsearch connection error"}
        except Exception as e:
            return {"error": str(e)}
    return wrapper

class GeneralUtils:
    @staticmethod
    def create_vector_embedding(query):
        """    Create a vector embedding for the query using SentenceTransformer.
        Args:
            query (str): The input query to be embedded.
        This function initializes a SentenceTransformer model and encodes the query into a vector.
        """
        if type(query) is not str:
            query = " ".join(query)
        # Initialize the SentenceTransformer model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        # Create the embedding
        embedding = model.encode(query)
        return embedding.tolist()  # Convert to list for compatibility with Elasticsearch
    
class ElasticsearchUtils:
    def __init__(self, index_name, host_address):
        self.es = Elasticsearch(host_address)
        self.index_name = index_name
    @api_error_handler
    def full_text_search(self, query,output_fields=["title", "description", "genres", "actors", "directors","poster_path"],search_fields=["title", "description", "genres", "actors", "directors"]):
        """
        Perform a full-text search on the Elasticsearch index for movies.
        Args:
            query (str): The search query.
            index_name (str): The name of the Elasticsearch index.
        """
        ## ["title", "vote_average", "tagline", "cast", "director", "producer", "release_date", "overview", "release_date", "poster_path", "genres", "poster_path", "popularity", "academy_winner"],
        # filter the output fields
        search_query = {
            "_source": output_fields,
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": search_fields,
                }
            }
        }
        response = self.es.search(index=self.index_name, body=search_query)
        return [hit['_source'] for hit in response['hits']['hits']]

    @api_error_handler
    def semantic_search(self, query, output_fields=["title", "description", "genres", "actors", "directors", "poster_path  "], k=5, num_candidates=100):
        """
        Perform a semantic search on the Elasticsearch index for movies.
        Args:
            query (str): The search query.
            index_name (str): The name of the Elasticsearch index.
        """
        query_vector = GeneralUtils.create_vector_embedding(query)
        search_query = {
            ## "_source": ["title", "vote_average", "tagline", "cast", "director", "producer", "release_date", "overview", "release_date", "poster_path", "genres", "poster_path", "popularity", "academy_winner"],
            "_source": output_fields,
            "query": {
                "knn": {
                    "field": "embedding",  # Assuming 'embeddings' is the field with vector data
                    "query_vector": query_vector,  # Use the created vector
                    "k": k,  # Number of nearest neighbors to returnn
                    "num_candidates": num_candidates # Number of candidates to consider
                }
            }
        }
        response = self.es.search(index=self.index_name, body=search_query)
        return [hit['_source'] for hit in response['hits']['hits']]
    
    @api_error_handler
    def fetch_embedding(self, poster_path):
            search_query = {
                    "_source": ["title", "embedding"],
                    "query": {
                        "match": {
                            "poster_path": poster_path
                        }
                    }
                }
            response = self.es.search(index="movie_data_9", body=search_query)
            # lets get the vector embedding for the movie
            vector_embedding = response["hits"]["hits"][0]["_source"]["embedding"]
            id = response["hits"]["hits"][0]["_id"]
            return id, vector_embedding
    @api_error_handler
    def fetch_similar_movies(self, poster_path):
        """
        Fetch similar movies for a given poster path using KNN + function_score query in Elasticsearch.
        """
        print("hello from fetch_similar_movies")

        id, vector_embed = self.fetch_embedding(poster_path)

        # Construct KNN and filter query
        knn_query = {
            "knn": {
                "field": "embedding",
                "query_vector": vector_embed,
                "k": 100,
                "num_candidates": 1000
            }
        }

        must_not_filter = {
            "term": {
                "movie_id.keyword": id
            }
        }

        # Define scoring functions
        functions = [
            {
                "filter": {"range": {"imdb_rating": {"gte": 7.0}}},
                "weight": 1.5
            },
            {
                "field_value_factor": {
                    "field": "popularity",
                    "factor": 0.3,
                    "modifier": "log1p"
                }
            },
            {
                "random_score": {
                    "seed": hash(id) % 1000
                },
                "weight": 0.3
            }
        ]

        # Combine everything into one search query
        search_query = {
            "size": 10,
            "_source": [
                "title", "vote_average", "tagline", "cast", "director",
                "producer", "release_date", "overview", "poster_path"
            ],
            "query": {
                "function_score": {
                    "query": {
                        "bool": {
                            "must": [knn_query],
                            "must_not": [must_not_filter]
                        }
                    },
                    "functions": functions,
                    "score_mode": "multiply"
                }
            }
        }

        response = self.es.search(index=self.index_name, body=search_query)
        return [hit['_source'] for hit in response['hits']['hits']] if response['hits']['hits'] else []

    @api_error_handler
    def detailed_info(self, poster_path):
        """
        Fetch detailed information about a movie based on its poster path.
        Args:
            poster_path (str): The poster path of the movie.
        Returns:
            dict: A dictionary containing detailed movie information.
        """
        print("Fetching detailed info for poster:", poster_path)
        search_query = {
            "_source": {
                "excludes": ["embedding"]
            },
            "query": {
                "match": {
                    "poster_path": poster_path
                }
            }
        }

        response = self.es.search(index=self.index_name, body=search_query)
        return response['hits']['hits'][0]['_source'] if response['hits']['hits'] else {}
    
    def get_watchlist(self, watchlist):
        """
        Fetch detailed information about movies in the user's watchlist.
        Args:
            watchlist (list): The list of movie names in the user's watchlist.
        """
        watchlist_detailed_info = []
        for movie in watchlist:
            movie = movie.strip()
            if not movie:
                continue
            res = ElasticsearchUtils.full_text_search(movie)
            if res:
                watchlist_detailed_info.append(res[0])  # Assuming the first result is the most relevant
        return watchlist_detailed_info


