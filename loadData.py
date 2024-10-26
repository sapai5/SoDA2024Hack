import csv
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import tkinter as tk
from tkinter import ttk

# MongoDB connection URI
URI = 'mongodb+srv://sapai1:sapai1@profilecluster.c2zhh.mongodb.net/?retryWrites=true&w=majority&appName=profileCluster'

# Connect to MongoDB
client = MongoClient(URI, server_api=ServerApi('1'))
db = client['sapai1']  # Access the database
students = db['studentsDB']  # Access the 'students' collection

# Load CSV data from file
csv_file = 'student_profiles.csv'  # Replace with your actual CSV filename

with open(csv_file, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)  # Read CSV into a list of dictionaries
    student_data = list(reader)  # Convert the reader object to a list

# Tkinter setup for the progress bar window
root = tk.Tk()
root.title("Uploading Student Data")
root.geometry("400x100")

# Create the progress bar widget
progress_bar = ttk.Progressbar(root, orient='horizontal', length=300, mode='determinate')
progress_bar.pack(pady=20)

# Function to update the progress bar during insertion
def upload_data():
    total_students = len(student_data)
    for i, student in enumerate(student_data):
        # Insert the student's information into MongoDB
        result = students.insert_one(student)
        print(f"Inserted student with ID: {result.inserted_id}")  # Optional for debugging

        # Update the progress bar
        progress_bar['value'] = ((i + 1) / total_students) * 100
        root.update_idletasks()  # Force update of the Tkinter GUI

    print(f"Total students inserted: {total_students}")
    client.close()  # Close the MongoDB connection
    root.quit()  # Close the progress bar window

# Start the upload process
root.after(100, upload_data)  # Start after 100ms delay to initialize the GUI
root.mainloop()
