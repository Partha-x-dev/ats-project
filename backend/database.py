import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",         # Update if your MySQL username is different
        password="Partha@105",         # Add your MySQL password here if you use one
        database="ats_db"
    )
    return connection