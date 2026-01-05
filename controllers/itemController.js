const pool = require("../db/pool");

// 1. Show the form
async function createItemGet(req, res) {
    // We need to fetch all categories so the user can pick one in a dropdown
    const { rows } = await pool.query("SELECT * FROM categories");
    res.render("item_form", {
        title: "Add New Item",
        categories: rows
    });
}

// 2. Handle the form submission
async function createItemPost(req, res) {
    const { name, description, price, stock, category_id } = req.body;
    try {
        await pool.query(
            "INSERT INTO items (name, description, price, stock_qty, category_id) VALUES ($1, $2, $3, $4, $5)",
            [name, description, price, stock, category_id]
        );
        res.redirect("/categories/" + category_id); // Go back to the category page
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving item");
    }
}

async function deleteItemPost(req, res) {
    const { id } = req.params;
    const { admin_password } = req.body;

    // 1. Extra Credit: Check the secret password
    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Incorrect Admin Password! Access Denied.");
    }

    try {
        // 2. Perform the deletion
        await pool.query("DELETE FROM items WHERE id = $1", [id]);

        // 3. Redirect back to the categories list (or wherever you prefer)
        res.redirect("/categories");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting item");
    }
}

// 1. Show the Edit Form (Pre-filled with data)
async function updateItemGet(req, res) {
    const { id } = req.params;
    try {
        const itemRes = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
        const categoriesRes = await pool.query("SELECT * FROM categories");

        const item = itemRes.rows[0];
        const categories = categoriesRes.rows;

        res.render("item_update_form", {
            title: "Update Item",
            item: item,
            categories: categories
        });
    } catch (err) {
        res.status(500).send("Database Error");
    }
}

// 2. Handle the Update Request
async function updateItemPost(req, res) {
    const { id } = req.params;
    const { name, description, price, stock, category_id, admin_password } = req.body;

    // Secret Password Check (Extra Credit)
    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Incorrect Admin Password!");
    }

    try {
        await pool.query(
            "UPDATE items SET name=$1, description=$2, price=$3, stock_qty=$4, category_id=$5 WHERE id=$6",
            [name, description, price, stock, category_id, id]
        );
        res.redirect("/categories/" + category_id);
    } catch (err) {
        res.status(500).send("Error updating item");
    }
}

async function updateItemPost(req, res) {
    const { id } = req.params;
    const { name, description, price, stock, category_id, admin_password } = req.body;

    // Secret Password Check (Extra Credit)
    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).send("Incorrect Admin Password!");
    }

    try {
        await pool.query(
            "UPDATE items SET name=$1, description=$2, price=$3, stock_qty=$4, category_id=$5 WHERE id=$6",
            [name, description, price, stock, category_id, id]
        );
        res.redirect("/categories/" + category_id);
    } catch (err) {
        res.status(500).send("Error updating item");
    }
}

module.exports = {
    createItemGet,
    createItemPost,
    deleteItemPost,
    updateItemGet,
    updateItemPost
};