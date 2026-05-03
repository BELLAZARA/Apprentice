from flask import render_template, redirect, url_for

def home_view():
    """Home page with general information"""
    return render_template('index.html')

def index_view():
    """Default index page - redirect to login"""
    return redirect(url_for('auth.login'))
