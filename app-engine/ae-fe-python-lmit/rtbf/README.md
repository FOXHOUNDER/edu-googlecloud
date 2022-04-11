# rtbf

Di seguito la lista di comandi per avviare l'app in locale e in remoto (Google Cloud).

Comandi da eseguire in locale:
```
# gcp conf
gcloud config list
gcloud config set project <REDACTED>
gcloud config set project <REDACTED>

# appengine flex standard
python3 -m pip install virtualenv (solo una volta) 
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
$env:GOOGLE_APPLICATION_CREDENTIALS=".\credentials\<REDACTED>.json"
$env:MAPP_APIKEY="bG...MjE="
python main.py
http://localhost:8080

# appengine custom (locale)
docker build -t rtbf-i ./
docker images
docker run -it --rm -p 8080:8080 --name rtbf-c rtbf-i
```
Comandi da eseguire per il rilascio su GCP per Cloud Run:
```
# appengine custom (remoto)
gcloud app deploy (gcloud app deploy ~/my_app/app.yaml --project=PROJECT)
```