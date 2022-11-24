def get_audit_logs():
    text_file = open("/var/log/cc-logs/generator.log", "r")
    data = text_file.read()
    text_file.close()
    return data