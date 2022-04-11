import os
import requests
from pprint import pprint

TEALIUM_APIKEY  = os.environ['TEALIUM_APIKEY']
TEALIUM_ACCOUNT = os.environ['TEALIUM_ACCOUNT']
TEALIUM_PROFILE = os.environ['TEALIUM_PROFILE']


def auth(username, key):
  token = None
  url = "https://api.tealiumiq.com/v2/auth"
  payload='username={}&key={}'.format(username, key)
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try:
    response = requests.request("POST", url, headers=headers, data=payload)
    if response.status_code == 200:
      token = response.json()
    else:
      print("Login error")
  except:
    print("AUTH request error")
  
  return token


def get_contact(num_cli):
  transaction_id = None
  url = "https://api.tealiumiq.com/v2/visitor/accounts/{}/profiles/{}?attributeId=6427&attributeValue={}".format(TEALIUM_ACCOUNT, TEALIUM_PROFILE, num_cli)
  payload={}
  token = auth('<REDACTED>', TEALIUM_APIKEY)['token']

  if token is None:
    print("Can't auth!")
  else:
    try:
      headers = {
        'Authorization': 'Bearer {}'.format(token)
      }
      response = requests.request("GET", url, headers=headers, data=payload)
      if response.status_code == 200:
        transaction_id = response.json()['transactionId']
        pprint(response.json())
      else:
        print("Can't find NUM_CLI")
    except:
      print("GET request error")

  return transaction_id


def delete_contact(num_cli):
  transaction_id = None
  attributeId = 6427
  url = "https://api.tealiumiq.com/v2/visitor/accounts/{}/profiles/{}".format(TEALIUM_ACCOUNT, TEALIUM_PROFILE)
  payload='attributeId={}&attributeValue={}'.format(attributeId, num_cli)
  token = auth('<REDACTED>', TEALIUM_APIKEY)['token']

  if token is None:
    print("Can't auth!")
  else:
    try:
      headers = {
        'Authorization': 'Bearer {}'.format(token),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      response = requests.request("DELETE", url, headers=headers, data=payload)
      pprint(response.json())
      if response.status_code == 202:
        transaction_id = response.json()['transactionId']
      else:
        print("Can't find NUM_CLI")
    except:
      print("DELETE request error")

  return transaction_id



if __name__=='__main__':
  delete_contact(13411693) #5567592