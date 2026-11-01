FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && \
    curl -L https://github.com/Orange-OpenSource/hurl/releases/download/8.1.0/hurl-8.1.0-x86_64-unknown-linux-gnu.tar.gz \
      -o /tmp/hurl.tar.gz && \
    tar xzf /tmp/hurl.tar.gz -C /usr/local/bin --strip-components=2 hurl-8.1.0-x86_64-unknown-linux-gnu/bin/hurl && \
    rm /tmp/hurl.tar.gz && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --timeout 120 --retries 5 pytest requests
RUN pip install --no-cache-dir --timeout 120 --retries 5 playwright && \
    playwright install --with-deps chromium

WORKDIR /tests
