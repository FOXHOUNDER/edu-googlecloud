import os
import database
import mapp
import tealium

from flask import Flask
from flask import request
from flask import render_template
from mailjet_rest import Client
from datetime import date, timedelta

app = Flask(__name__)

ENV = os.environ['ENV']

@app.route('/')
def index():
  return render_template('index.html', message='')


@app.route("/rtbf", methods=['POST'])
def rtbf():

  if request.method == 'POST':
    num_cli = request.form.get('num_cli')
  else:
    return ''
  
  out_db = None
  out_mapp = None
  out_tealium = None

  # Config MailJet
  api_key = os.environ['MJ_APIKEY_PUBLIC']
  api_secret = os.environ['MJ_APIKEY_PRIVATE']
  mailjet = Client(auth=(api_key, api_secret), version='v3.1')

  # DB MARKETING
  out_db = database.rtbf_contact(num_cli)

  if ENV=='prod':
    # MAPP
    mapp_id = mapp.delete_contact(num_cli);
    out_mapp = "<br/>Mapp contact deleted: {}".format(mapp_id or "NOT FOUND")

    # TEALIUM
    tealium_txid = tealium.delete_contact(num_cli)
    out_tealium = "<br/>Tealium contact scheduled for deletion. Transaction ID: {}".format(tealium_txid or "NOT FOUND")

    to_email="<REDACTED>"
  else:
    to_email="<REDACTED>"

  end_m = (out_db or "ERROR") + (out_mapp or "<br/>MAPP DELETE IS NOT RUN IN DEV") + (out_tealium or "<br/>TEALIUM DELETE IS NOT RUN IN DEV")

  data = {
    'Messages': [
      {
        "From": {
          "Email": "<REDACTED>"
        },
        "To": [
          {
            "Email": to_email
          }
        ],
        "Subject": "[RTBF] Conclusione processo RTBF su DB Marketing {}".format(num_cli),
        "HTMLPart": "Ecco i risultati per {}: <br/>- First step+Second step:<br/>{}<br/>- Mapp: {}<br/>-Tealium: {}".format(num_cli, out_db, out_mapp, out_tealium)
      }
    ]
  }

  mailjet.send.create(data)

  return render_template('index.html', message=end_m)



if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))