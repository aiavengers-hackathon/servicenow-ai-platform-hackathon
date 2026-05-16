def detect_intent(text: str):

    text = text.lower()

    # ACCESS REQUESTS
    if (
        "access" in text
        or "permission" in text
        or "role" in text
    ):
        return {
            "type": "access_request",
            "application": extract_application(text),
            "urgency": "medium"
        }

    # INCIDENTS
    if (
        "vpn" in text
        or "not working" in text
        or "issue" in text
        or "error" in text
        or "down" in text
    ):
        return {
            "type": "incident",
            "severity": "high"
        }

    # CHANGE REQUESTS
    if (
        "change" in text
        or "update" in text
        or "modify" in text
    ):
        return {
            "type": "change_request"
        }

    return {
        "type": "general"
    }


def extract_application(text: str):

    words = text.split()

    ignore = [
        "i",
        "need",
        "access",
        "for",
        "to",
        "application"
    ]

    apps = [
        w.upper()
        for w in words
        if w.lower() not in ignore
    ]

    return apps[0] if apps else "Unknown"