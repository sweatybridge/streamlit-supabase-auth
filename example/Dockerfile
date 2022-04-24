FROM python:3.8 as build

WORKDIR /opt/streamlit_supabase_auth

RUN pip install --no-cache-dir build

COPY setup.py .
COPY README.md .
COPY MANIFEST.in .
COPY streamlit_supabase_auth/__init__.py ./streamlit_supabase_auth/
COPY streamlit_supabase_auth/frontend/build ./streamlit_supabase_auth/frontend/build

RUN python3 -m build

FROM python:3.8

COPY --from=build /opt/streamlit_supabase_auth/dist /opt/

WORKDIR /app

RUN pip install --no-cache-dir /opt/streamlit_supabase_auth-*-py3-none-any.whl streamlit-text-label
