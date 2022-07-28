FROM node:16 as frontend

WORKDIR /frontend

COPY streamlit_supabase_auth/frontend/package.json .
COPY streamlit_supabase_auth/frontend/package-lock.json .
RUN npm install

FROM frontend as build-js

COPY streamlit_supabase_auth/frontend/tsconfig.json tsconfig.json
COPY streamlit_supabase_auth/frontend/public public
COPY streamlit_supabase_auth/frontend/src src
RUN npm run build

FROM python:3.10 as build

COPY --from=build-js /frontend/build /opt/streamlit_supabase_auth/frontend/build

WORKDIR /opt
RUN pip install --no-cache-dir build

COPY setup.py .
COPY MANIFEST.in .
COPY README.md .
COPY streamlit_supabase_auth/__init__.py ./streamlit_supabase_auth/
RUN python3 -m build

FROM python:3.10-alpine3.16

COPY --from=build /opt/dist /opt/

# Dependencies required by streamlit
RUN apk add --no-cache \
    apache-arrow --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/community \
    py3-apache-arrow --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/testing \
    py3-pandas --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/community \
    py3-psutil --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/community \
    py3-pillow --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/community \
    py3-pyzmq --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/community \
    py3-cffi --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/main

# Include pre-compiled packages from apk
ENV PYTHONPATH /usr/lib/python3.10/site-packages
# Disable version check for faster build
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
# Disable cache for smaller image
ENV PIP_NO_CACHE_DIR 1

WORKDIR /app

RUN pip install --no-cache-dir /opt/streamlit_supabase_auth-*-py3-none-any.whl

COPY example/.streamlit .streamlit
COPY example/app.py example/app.py

ENTRYPOINT [ "streamlit" ]
CMD [ "run", "example/app.py" ]
