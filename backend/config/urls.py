import os
from django.http import JsonResponse
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from .settings import FRONTEND_DIST_DIR


def api_home(request):
    return JsonResponse({
        'name': 'FORM ecommerce API',
        'endpoints': ['/api/products/', '/api/orders/'],
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),
]

# If the React app has been built (frontend/dist exists), let Django serve it
# directly so the whole site runs from a single server: `python manage.py runserver`.
# React Router routes (e.g. /shop, /cart) fall through to index.html so the SPA
# router can take over client-side. Without a build, '/' falls back to a small
# JSON status page so the API is still usable on its own.
if os.path.exists(os.path.join(FRONTEND_DIST_DIR, 'index.html')):
    urlpatterns += [
        re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
    ]
else:
    urlpatterns += [path('', api_home)]
