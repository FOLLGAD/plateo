from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import base64

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

def get_random_filename():
    return base64.urlsafe_b64encode(os.urandom(6)).decode().replace("=", "").replace("-", "_").replace("/", "_")

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    filename = file.filename
    extension = filename.split(".")[-1]
    random_filename = get_random_filename()
    a = await file.read()
    with open(f"static/{random_filename}.{extension}", "wb") as f:
        f.write(a)
    return {"message": f"File {filename} uploaded"}


@app.get("/img")
async def img():
    return FileResponse("static/img.png")

