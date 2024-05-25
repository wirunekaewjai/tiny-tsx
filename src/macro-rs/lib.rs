pub fn esc_quot(input: &str) -> String {
    input.replace('"', "&quot;")
}

pub fn map<T>(items: Vec<T>, render: &dyn Fn(&T) -> String) -> String {
    items.iter().map(render).collect::<Vec<String>>().join("")
}
