# Intentionally vulnerable Dockerfile for IVAS IaC scan QA.

# 1) Outdated base image with known CVEs
FROM node:10.13.0-alpine

# 2) Running as root (no USER directive at the end)
USER root

# 3) Curl pipe to shell — supply chain risk pattern
RUN apk add --no-cache curl bash \
 && curl -sL https://example.com/install.sh | bash

# 4) Hardcoded secrets in image layers
ENV AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
ENV AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
ENV DB_PASSWORD=admin1234!

# 5) ADD with remote URL (instead of curl + verify)
ADD https://example.com/payload.tar.gz /tmp/

# 6) Privileged commands left in image
RUN echo 'root:toor' | chpasswd \
 && echo "labrador ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 7) chmod 777 on app dir
WORKDIR /app
COPY . .
RUN chmod -R 777 /app

# 8) Old npm install with potentially malicious postinstall scripts allowed
RUN npm install --unsafe-perm

# 9) Exposes everything
EXPOSE 22 80 443 3306 5432 6379 8080 9200

# 10) No HEALTHCHECK, no non-root USER, runs everything as root
ENTRYPOINT ["node", "index.js"]
