from django.urls import path
from . import views

#  urls for backend features 
urlpatterns = [
	path('api/containers/', views.index_containers),
	path('api/services/', views.index_services),
	path('api/hosts/', views.index_hosts),
	path('api/labels/',views.index_labels),
	path('api/settings/',views.index_settings),
	path('api/status/',views.index_status),
	path('api/version_info/',views.index_version_info),
	path('api/logs/',views.index_logs_containers),
	path('api/servicetypes/',views.index_service_types),
	path('api/migrateservices/',views.index_migrate_services),
	path('api/auditlogs/',views.index_audit_logs),
	path('api/notifications/',views.index_notifications),
	path('api/login/',views.index_container_login),
	path('api/user/',views.index_user),
	path('api/hostmigrate/',views.index_host_migration),
]
