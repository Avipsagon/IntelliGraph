# IntelliGraph 🧠

**IntelliGraph** is a graph-theory-based application designed to solve two practical problems: navigating a university campus efficiently and organizing study topics according to their prerequisites.

The project applies fundamental graph algorithms to real-world scenarios, transforming abstract mathematical concepts into an interactive and practical solution.

## 📌 Project Overview

IntelliGraph consists of two modules:

### 1. Campus Navigation
Represents the university campus as an undirected weighted graph, where locations are vertices and connecting paths are edges.

- Finds the shortest route between two campus locations.
- Uses **Dijkstra's Shortest Path Algorithm**.
- Considers different campus connections, including stairs and ramps.
- Displays the route and its total path weight.

### 2. Study Priority Planner
Represents academic topics as vertices and prerequisite relationships as directed edges.

- Organizes topics according to their dependencies.
- Generates a valid study sequence.
- Uses **Topological Sorting with Kahn's Algorithm**.
- Detects circular dependencies in topic prerequisites.

## 🧮 Graph Theory Concepts Used

- Graphs and vertices
- Edges and edge weights
- Undirected and directed graphs
- Adjacency lists
- Shortest path
- Dijkstra's Algorithm
- Directed Acyclic Graph (DAG)
- Topological Sorting
- Kahn's Algorithm
- Cycle Detection

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- SVG (for graph visualization)

## 📂 Project Structure

```text
IntelliGraph/
│
├── index.html      # Main webpage and interface
├── style.css      # Styling, layout and themes
├── script.js      # Graph data, algorithms and functionality
└── README.md      # Project documentation
```

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/IntelliGraph.git
   ```

2. Open the project folder.

3. Open `index.html` in your browser, or run it using the Live Server extension in VS Code.

## 🎯 Project Objectives

- Apply graph theory to practical problems.
- Implement shortest-path and dependency-ordering algorithms.
- Visualize graph structures and relationships.
- Develop an interactive and user-friendly interface.
- Demonstrate the application of Discrete Mathematics in software development.

## 📚 Academic Context

This project is developed as part of the **Discrete Mathematics** coursework for B.Tech Computer Science and Engineering at Manav Rachna University.

## 🔮 Future Scope

- Incorporating actual campus distances for more accurate route calculations.
- Adding accessibility-aware route preferences.
- Expanding the study planner with dynamic topic and prerequisite management.
- Improving graph visualization and user interaction.
- Introducing additional graph-based planning features.

## 👩‍💻 Contributors

**Avipsa Gon**  
B.Tech Computer Science and Engineering  
Manav Rachna University

---

*Built to connect mathematical concepts with real-world applications.*
