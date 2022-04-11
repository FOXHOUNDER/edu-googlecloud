Create Virtual Environment
python3 -m pip install --upgrade pip
python3 -m pip install virtualenv
python3 -m venv env
.\env\Scripts\activate
.. have fun ..
pip install -r .\HelloWorld\dependencies
pip install wheel
pip install 'apache-beam[gcp]'
.. have more fun ..
deactivate

to run locally, just run the py
to run on dataflow, run (this will run the wordocunt example online)
  python -m apache_beam.examples.wordcount --region us-central1 --input gs://dataflow-samples/shakespeare/kinglear.txt --output gs://cert-339910-dfdemo/results/outputs --runner DataflowRunner --project cert-339910 --temp_location gs://cert-339910-dfdemo/temp/

  python -m Wordcount.py runner DataflowRunner --region us-central1 --project cert-339910 --staging_location gs://cert-339910-dfdemo/staging --temp_location gs://cert-339910-dfdemo/temp --template_location gs://cert-339910-dfdemo/templates/Wordcount