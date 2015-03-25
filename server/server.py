from flask import Flask, send_from_directory

app = Flask(__name__)
app.debug = True

staticRoot = '../client'

# Routes
@app.route('/')
def root():
  return send_from_directory(staticRoot, 'app.html')

@app.route('/<path:path>')
def staticFiles(path):
    return send_from_directory(staticRoot, path)

if __name__ == '__main__':
  app.run()