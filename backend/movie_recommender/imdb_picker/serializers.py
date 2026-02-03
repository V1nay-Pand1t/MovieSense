from rest_framework import serializers

class MovieData2Serializer(serializers.Serializer):
    adult = serializers.BooleanField(required=False)
    embeddings = serializers.ListField(
        child=serializers.FloatField(), min_length=384, max_length=384, required=False
    )
    genres = serializers.CharField(required=False)
    imdb_id = serializers.CharField(required=False)
    keywords = serializers.CharField(required=False)
    original_title = serializers.CharField(required=False)
    overview = serializers.CharField(required=False)
    popularity = serializers.FloatField(required=False)
    poster_path = serializers.CharField(required=False)
    production_countries = serializers.CharField(required=False)
    release_date = serializers.CharField(required=False)
    runtime = serializers.IntegerField(required=False)
    spoken_languages = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    text = serializers.CharField(required=False)
    vote_average = serializers.FloatField(required=False)
    movie_title = serializers.CharField(source="title", required=False)
    vote_count = serializers.IntegerField(required=False)
