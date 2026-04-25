from rest_framework.permissions import BasePermission


def user_has_permission(user, slug: str) -> bool:
    if not user.is_authenticated:
        return False
    return user.policy_assignments.filter(policy__policy_permissions__permission__slug=slug).exists()


class RequiresTenantPermission(BasePermission):
    required_permission = None

    def has_permission(self, request, view):
        required_permission = getattr(view, "required_permission", self.required_permission)
        if not required_permission:
            return True
        return user_has_permission(request.user, required_permission)
