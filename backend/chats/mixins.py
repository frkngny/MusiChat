from django.shortcuts import get_object_or_404
from django.http import Http404

class MultipleFieldLookupMixin:
    def get_object(self):
        
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        
        if len(self.request.GET) == 0:
            raise Http404(
                "No %s matches the given query." % queryset.model._meta.object_name
            )
            
        filter = {}
        for field in self.lookup_fields:
            if self.request.GET.get(field): # Ignore empty fields.
                filter[field] = self.request.GET[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj