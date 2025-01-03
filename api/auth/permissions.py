from rest_framework import permissions

class EditOwnerOnly(permissions.BasePermission):

    # Overriding has_object_permission method
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            # Read permissions are allowed to any request
            return True

        # Check if the user is the owner of the object
        return obj.user == request.user