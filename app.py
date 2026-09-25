from flask import Flask, render_template, request, abort, Response
from datetime import date
from services_data import SERVICES_DATA, SERVICES_LIST, get_service_by_slug

app = Flask(__name__)

@app.after_request
def add_header(response):
    if 'static/' in request.path:
        response.headers['Cache-Control'] = 'public, max-age=31536000'
    return response

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html', services=SERVICES_LIST)

@app.route('/services/<slug>')
def service_detail(slug):
    service = get_service_by_slug(slug)
    if not service:
        abort(404)
    # Get 3 related services excluding current
    related_services = [s for s in SERVICES_LIST if s['slug'] != slug][:3]
    return render_template('service_detail.html', service=service, related_services=related_services, all_services=SERVICES_LIST)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/robots.txt')
def robots_txt():
    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        f"Sitemap: {request.url_root.rstrip('/')}/sitemap.xml",
    ]
    return Response("\n".join(lines), mimetype="text/plain")

@app.route('/sitemap.xml')
def sitemap_xml():
    base = request.url_root.rstrip('/')
    today = date.today().isoformat()
    static_pages = [
        ("/", "1.0"),
        ("/about", "0.9"),
        ("/services", "0.9"),
        ("/gallery", "0.8"),
        ("/contact", "0.8"),
    ]
    urls = [
        {"loc": f"{base}{path}", "priority": priority, "lastmod": today}
        for path, priority in static_pages
    ]
    urls += [
        {"loc": f"{base}/services/{s['slug']}", "priority": "0.7", "lastmod": today}
        for s in SERVICES_LIST
    ]
    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        xml_parts.append(
            f"  <url><loc>{u['loc']}</loc><lastmod>{u['lastmod']}</lastmod>"
            f"<priority>{u['priority']}</priority></url>"
        )
    xml_parts.append('</urlset>')
    return Response("\n".join(xml_parts), mimetype="application/xml")

if __name__ == '__main__':
    app.run(debug=True, port=5001)

