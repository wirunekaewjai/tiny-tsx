pub fn esc_quot(input: &str) -> String {
    input.replace('"', "&quot;")
}