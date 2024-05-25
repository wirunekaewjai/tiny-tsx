pub fn tsx_join<T: std::fmt::Display>(items: &Vec<T>) -> String {
    items.iter().map(|e| e.to_string()).collect::<Vec<String>>().join("")
}

pub fn tsx_map<T>(items: &Vec<T>, render: &dyn Fn(&T) -> String) -> String {
    items.iter().map(render).collect::<Vec<String>>().join("")
}

pub fn tsx_quot(value: &str) -> String {
    value.replace('"', "&quot;")
}
