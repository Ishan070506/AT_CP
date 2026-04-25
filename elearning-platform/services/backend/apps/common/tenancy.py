from contextvars import ContextVar


current_tenant_id: ContextVar[str | None] = ContextVar("current_tenant_id", default=None)


def set_current_tenant_id(tenant_id: str | None) -> None:
    current_tenant_id.set(tenant_id)


def get_current_tenant_id() -> str | None:
    return current_tenant_id.get()
