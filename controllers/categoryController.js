const pool = require("../db/pool");

exports.getAllCategories = async (req, res) => {
    try {
        // Query the database for all categories
        const { rows } = await pool.query("SELECT * FROM categories ORDER BY name ASC");

        // Render the 'categories' view and pass the data
        res.render("categories", {
            title: "Categories",
            categories: rows
        });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).send("Internal Server Error");
    }
}

exports.getCategoryItems = async (req, res) => {
    const { id } = req.params; // Grabs the ID from the URL
    try {
        // Fetch category details
        const categoryRes = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
        const category = categoryRes.rows[0];

        // Fetch items in this category
        const itemsRes = await pool.query("SELECT * FROM items WHERE category_id = $1", [id]);
        const items = itemsRes.rows;

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render("category_detail", {
            title: category.name,
            category: category,
            items: items
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
}

// --- CREATE ---
exports.createCategoryGet = (req, res) => {
    res.render("category_form", { title: "Create New Category", category: null });
};

exports.createCategoryPost = async (req, res) => {
    const { name, description } = req.body;
    await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [name, description]);
    res.redirect("/categories");
};

// --- UPDATE ---
exports.updateCategoryGet = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    res.render("category_form", { title: "Edit Category", category: rows[0] });
};

exports.updateCategoryPost = async (req, res) => {
    const { id } = req.params;
    const { name, description, admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Wrong Admin Password");
    }

    await pool.query("UPDATE categories SET name=$1, description=$2 WHERE id=$3", [name, description, id]);
    res.redirect("/categories");
};

// --- DELETE ---
exports.deleteCategoryPost = async (req, res) => {
    const { id } = req.params;
    const { admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Wrong Admin Password");
    }

    // Note: Because of ON DELETE CASCADE in our SQL, this will delete all items in the category too!
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    res.redirect("/categories");
};
