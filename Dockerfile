FROM denoland/deno:2.1.9


WORKDIR /app

# Prefer not to run as root.
# USER deno

# RUN chown -R deno:deno /app

COPY . .

ENTRYPOINT [ "deno", "run", "telegram" ]