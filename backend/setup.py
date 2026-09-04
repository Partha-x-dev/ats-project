import mysql.connector

# Connect to your local MySQL server
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Partha@105"
)
cursor = conn.cursor()

# Read your existing schema.sql file from the database folder
with open("../database/schema.sql", "r") as f:
    sql_script = f.read()

# Execute the SQL commands from schema.sql
for statement in sql_script.split(";"):
    if statement.strip():
        cursor.execute(statement)

# Switch to the database and insert a test job so your frontend dropdown works
cursor.execute("USE ats_db;")
cursor.execute("""
    INSERT INTO jobs (title, department) 
    VALUES ('Software Engineer - Full Stack', 'Engineering')
""")

conn.commit()
cursor.close()
conn.close()

print("Database setup complete!")