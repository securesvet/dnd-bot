FROM denoland/deno:2.1.9


WORKDIR /app

# Prefer not to run as root.
USER deno

RUN cd /app

COPY . .
