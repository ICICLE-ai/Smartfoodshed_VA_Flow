if [ $server = "gunicorn" ]; then
    cd /app; /usr/local/bin/gunicorn --access-logfile - --workers $processes --threads $threads --timeout $timeout -b :5000 app:app
else
    python3 -u /app/app.py
fi