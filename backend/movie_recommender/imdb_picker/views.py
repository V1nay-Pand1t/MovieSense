from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from accounts.models import UserProfile
from rest_framework import status, generics, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authtoken.models import Token

from .utils import ElasticsearchUtils, GeneralUtils

from .serializers import MovieData2Serializer
# provide access to endpoint without authentication
from rest_framework.permissions import AllowAny

INDEX_NAME = "movie_data_9"
ElasticsearchUtils = ElasticsearchUtils(index_name=INDEX_NAME, host_address="http://elasticsearch:9200")
class MovieViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    @action(detail=False, methods=['get'], url_path='full_text_search')
    def movie_full_text_search(self, request):
        query = request.GET.get('q', '')
        results = []
        if query:
            results = ElasticsearchUtils.full_text_search(query)
        print("results:")
        print(results)
        serializer = MovieData2Serializer(results, many=True)
        return Response({'results': serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='semantic_search')
    def movie_semantic_search(self, request):
        query = request.GET.get('q', '')
        results = []
        if query:
            results = ElasticsearchUtils.semantic_search(query)
        return Response({'results': results}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='info')
    def movie_info(self, request):
       poster_path = request.GET.get('q', '')
       if not poster_path:
           return Response({'error': 'Query parameter "q" is required.'}, status=status.HTTP_400_BAD_REQUEST)
       detailed_movie_data = ElasticsearchUtils.detailed_info(poster_path=poster_path)
       similar_movies = ElasticsearchUtils.fetch_similar_movies(poster_path=poster_path)
       print("similar_movies", similar_movies)
       detailed_movie_data['similar_movies'] = similar_movies
    
       return Response(detailed_movie_data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], url_path="list_movies")
    def list_movies(self, request):
        page = int(request.GET.get('page', 1))
        alphabet = request.GET.get('alphabet', 'A')
        movies_per_page = int(request.GET.get('movies_per_page', 10))
        movies, total_movies = ElasticsearchUtils.list_movies_by_alphabet(
            alphabet=alphabet,
            page=page,
            movies_per_page=movies_per_page
        )
        total_pages = GeneralUtils.calculate_total_pages(total_movies, movies_per_page)
        response_data = {
            'movies': movies,
            'total_movies': total_movies,
            'total_pages': total_pages,
            'current_page': page
        }
        return Response(response_data, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=["post"], url_path="update_watchlist")
    def update_watchlist(self, request):
        user = request.user
        movie_key = request.poster_path
        ## Lets update Userprofile model
        if not user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            profile = UserProfile.objects.get(user=request.user)
            profile.watchlist = profile.watchlist.append(movie_key)
            print("Profile watchlist updated")
            print(profile.watchlist)
            profile.save()
            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"error": "UserProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='watchlist')
    def get_watchlist(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        ## lets interact with the UserProfile model to get the watchlist
        try:
            ## pass sql query to get the watchlist
            watchlist = UserProfile.objects.raw_sql(
                "SELECT watchlist FROM accounts_userprofile WHERE username = %s", [user]
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        watchlist_detailed_info = ElasticsearchUtils.get_watchlist(watchlist)
        return Response({'watchlist': watchlist_detailed_info}, status=status.HTTP_200_OK)

    
