# Use the official lightweight Python image.
# https://hub.docker.com/_/python
# https://github.com/GoogleCloudPlatform/python-runtime
FROM gcr.io/google-appengine/python

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

#added service account to app
# NB swap env manually here
ADD credentials/<REDACTED>.json $APP_HOME

# Install production dependencies
RUN pip install Flask gunicorn
RUN pip install --upgrade google-cloud-bigquery
RUN pip install mailjet_rest
RUN pip install requests

#set service account into env
#ENV can be dev or prod
ENV ENV='prod'
# NB swap env manually here
ENV CREDENTIALS_PATH /app/<REDACTED>.json
ENV GOOGLE_APPLICATION_CREDENTIALS $CREDENTIALS_PATH
ENV MJ_APIKEY_PUBLIC='<REDACTED>'
ENV MJ_APIKEY_PRIVATE='<REDACTED>'
ENV MAPP_APIKEY='<REDACTED>'
ENV TEALIUM_APIKEY='<REDACTED>'
ENV TEALIUM_ACCOUNT='<REDACTED>'
ENV TEALIUM_PROFILE='<REDACTED>'

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
CMD gunicorn -b :$PORT --workers 1 --threads 8 --timeout 0 main:app