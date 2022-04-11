import requests
import os

# Set HTTP request headers, which are the same for all API calls
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Basic {}'.format(os.environ['MAPP_APIKEY'])
}


def get_contact(num_cli):
  print("Requested GET for NUM_CLI {} in Mapp ...".format(num_cli))

  # Set HTTP request json body.
  json_data = {
    'type': 'EMAIL',
    'value': '{}@<REDACTED>.it'.format(num_cli),
  }

  # Make the HTTP request.
  try:
    response_raw = requests.post('https://cvm.<REDACTED>.it/api/rest/v12/contact/get', headers=headers, json=json_data)
  except:
    print("GET returned error.")

  # Get the contact_id from the response.
  contact_id = None 
  if response_raw.status_code == 200:
    contact_id = response_raw.json()['contactId']
    response = "NUM_CLI {} EXISTS AS CONTACT ID {}".format(num_cli, contact_id)
  else:
    response = "CONTACT NOT FOUND!"

  print(response)
  return contact_id


def delete_contact(num_cli):
  print("Requested DELETE for NUM_CLI {} in Mapp ...".format(num_cli))

  contact_id = get_contact(num_cli) or None

  # Set HTTP request json body.
  json_data = {
    'type': 'EMAIL',
    'value': '{}@<REDACTED>.it'.format(num_cli),
  }

  # Make the HTTP request.
  if contact_id is not None:
    try:
      response_raw = requests.post('https://cvm.<REDACTED>.it/api/rest/v12/contact/delete', headers=headers, json=json_data)
      if response_raw.status_code == 204:
        response = "CONTACT ID {} DELETED FROM MAPP!".format(contact_id)
    except:
      print("DELETE returned error.")
  else:
    response = "DELETE SKIPPED"

  print(response)
  return contact_id



if __name__ == "__main__":
  delete_contact(num_cli="0000001")