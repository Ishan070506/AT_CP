import base64
import json
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class AESCipher:
    def __init__(self, key_material: str | None = None) -> None:
        raw_key = key_material or os.getenv("FIELD_ENCRYPTION_KEY", "")
        if not raw_key:
            self.key = None
            return
        self.key = base64.b64decode(raw_key)

    def encrypt_json(self, payload: dict | list) -> str:
        if self.key is None:
            return json.dumps(payload)
        aes = AESGCM(self.key)
        nonce = os.urandom(12)
        ciphertext = aes.encrypt(nonce, json.dumps(payload).encode("utf-8"), None)
        return base64.b64encode(nonce + ciphertext).decode("utf-8")

    def decrypt_json(self, payload: str) -> dict | list:
        if self.key is None:
            return json.loads(payload)
        aes = AESGCM(self.key)
        blob = base64.b64decode(payload)
        nonce, ciphertext = blob[:12], blob[12:]
        plaintext = aes.decrypt(nonce, ciphertext, None)
        return json.loads(plaintext.decode("utf-8"))
