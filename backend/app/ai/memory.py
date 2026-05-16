memory_store = []

def add_memory(message, response):

    memory_store.append({
        "message": message,
        "response": response
    })

def get_memory():

    return memory_store[-5:]