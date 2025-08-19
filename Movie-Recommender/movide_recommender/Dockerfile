FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt



# Copy the entire project into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# migrate the database

# migrate the database and run the Django development server
CMD ["sh", "-c", "python manage.py migratṇe && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
