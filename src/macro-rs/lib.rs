pub fn tsx_quot(value: &str) -> String {
    value.replace('"', "&quot;")
}

pub fn tsx_map<T>(items: &Vec<T>, render: &dyn Fn(&T) -> String) -> String {
    items.iter().map(render).collect::<Vec<String>>().join("")
}