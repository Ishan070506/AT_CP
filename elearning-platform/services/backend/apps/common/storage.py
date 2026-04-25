import boto3
from django.conf import settings
from pathlib import Path


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
    )


def put_object_bytes(*, key: str, body: bytes, content_type: str) -> str:
    try:
        client = get_s3_client()
        client.put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=body,
            ContentType=content_type,
        )
        return key
    except Exception:
        local_path = Path(settings.MEDIA_ROOT) / key
        local_path.parent.mkdir(parents=True, exist_ok=True)
        local_path.write_bytes(body)
        return key
