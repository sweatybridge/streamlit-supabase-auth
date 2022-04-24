import streamlit as st

from streamlit_supabase_auth import login_form, logout_button


def main():
    st.title("Component Gallery")
    st.header("Login with Supabase Auth")
    session = login_form(providers=["apple", "facebook", "github", "google"])
    st.write(session)
    if not session:
        return
    st.experimental_set_query_params(page=["success"])
    with st.sidebar:
        st.write(f"Welcome {session['user']['email']}")
        logout_button()


if __name__ == "__main__":
    main()
