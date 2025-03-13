FROM denoland/deno:2.2.3


WORKDIR /app

# Prefer not to run as root.
# USER deno

# RUN chown -R deno:deno /app

COPY . .

ENTRYPOINT [ "deno", "run", "telegram" ]