package com.brewly.brewly_backend.auth;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import com.brewly.brewly_backend.pos.Table;
import com.brewly.brewly_backend.pos.TableRepository;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataSeederService {

    private final IngredientRepository ingredientRepository;
    private final MenuItemRepository menuItemRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final TableRepository tableRepository;

    @Transactional
    public void seedDataForNewUser(User user) {
        // 1. Ingredients (Find or Create)
        Ingredient coffeeBeans = createIngredient(user, "Coffee Beans", 10000.0, "g", 500.0);
        Ingredient milk = createIngredient(user, "Milk", 5000.0, "ml", 100.0);
        Ingredient sugar = createIngredient(user, "Sugar", 5000.0, "g", 500.0);
        Ingredient water = createIngredient(user, "Water", 10000.0, "ml", 1000.0);
        Ingredient teaLeaves = createIngredient(user, "Tea Leaves", 2000.0, "g", 200.0);
        Ingredient flour = createIngredient(user, "Flour", 5000.0, "g", 500.0);
        Ingredient butter = createIngredient(user, "Butter", 2000.0, "g", 200.0);

        // 2. Menu Items (Find or Create)
        MenuItem cappuccino = createMenuItem(user, "Cappuccino", 120.0, "COFFEE",
                "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem latte = createMenuItem(user, "Latte", 130.0, "COFFEE",
                "https://images.unsplash.com/photo-1570968992193-6e584a3921b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem espresso = createMenuItem(user, "Espresso", 90.0, "COFFEE",
                "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem croissant = createMenuItem(user, "Croissant", 80.0, "SNACKS",
                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        // 3. Recipes (Ensure they exist)
        ensureRecipe(user, cappuccino, List.of(
                new RecipeDetail(coffeeBeans, 20.0),
                new RecipeDetail(milk, 150.0),
                new RecipeDetail(sugar, 10.0)));

        ensureRecipe(user, latte, List.of(
                new RecipeDetail(coffeeBeans, 20.0),
                new RecipeDetail(milk, 200.0),
                new RecipeDetail(sugar, 10.0)));

        ensureRecipe(user, espresso, List.of(
                new RecipeDetail(coffeeBeans, 20.0),
                new RecipeDetail(water, 30.0)));

        ensureRecipe(user, croissant, List.of(
                new RecipeDetail(flour, 50.0),
                new RecipeDetail(butter, 30.0),
                new RecipeDetail(sugar, 5.0)));

        // Add missing items that users might be seeing
        MenuItem vegBurger = createMenuItem(user, "Veg Burger", 99.0, "SNACKS",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        MenuItem burger = createMenuItem(user, "Burger", 149.0, "SNACKS",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        MenuItem periPeriFries = createMenuItem(user, "Peri Peri Fries", 120.0, "SNACKS",
                "https://images.unsplash.com/photo-1573080496982-b9418af17fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        // Ingredient needed
        Ingredient potato = createIngredient(user, "Potato", 5000.0, "g", 500.0);
        Ingredient bread = createIngredient(user, "Bread Bun", 50.0, "pcs", 5.0);
        Ingredient patty = createIngredient(user, "Veg Patty", 50.0, "pcs", 5.0);
        Ingredient spices = createIngredient(user, "Spices", 1000.0, "g", 100.0);

        ensureRecipe(user, vegBurger, List.of(
                new RecipeDetail(bread, 1.0),
                new RecipeDetail(patty, 1.0),
                new RecipeDetail(spices, 5.0)));

        ensureRecipe(user, burger, List.of(
                new RecipeDetail(bread, 1.0),
                new RecipeDetail(patty, 1.0),
                new RecipeDetail(spices, 5.0)));

        ensureRecipe(user, periPeriFries, List.of(
                new RecipeDetail(potato, 200.0),
                new RecipeDetail(spices, 10.0)));

        // Additional mock data for other categories
        MenuItem masalaTea = createMenuItem(user, "Masala Tea", 60.0, "TEA",
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem icedTea = createMenuItem(user, "Iced Lemon Tea", 110.0, "TEA",
                "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        MenuItem chocBrownie = createMenuItem(user, "Chocolate Brownie", 150.0, "DESSERT",
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem cheesecake = createMenuItem(user, "New York Cheesecake", 220.0, "DESSERT",
                "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        MenuItem mojito = createMenuItem(user, "Virgin Mojito", 140.0, "BEVERAGES",
                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        MenuItem coldCoffee = createMenuItem(user, "Cold Coffee", 160.0, "BEVERAGES",
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

        // Ensure recipes for new items
        Ingredient lemon = createIngredient(user, "Lemon", 50.0, "pcs", 10.0);
        Ingredient chocolate = createIngredient(user, "Chocolate", 2000.0, "g", 500.0);

        ensureRecipe(user, masalaTea, List.of(
                new RecipeDetail(teaLeaves, 10.0),
                new RecipeDetail(milk, 50.0),
                new RecipeDetail(water, 100.0),
                new RecipeDetail(sugar, 10.0)));

        ensureRecipe(user, icedTea, List.of(
                new RecipeDetail(teaLeaves, 15.0),
                new RecipeDetail(lemon, 0.5),
                new RecipeDetail(water, 200.0),
                new RecipeDetail(sugar, 15.0)));

        ensureRecipe(user, chocBrownie, List.of(
                new RecipeDetail(flour, 50.0),
                new RecipeDetail(chocolate, 30.0),
                new RecipeDetail(butter, 20.0),
                new RecipeDetail(sugar, 40.0)));

        ensureRecipe(user, cheesecake, List.of(
                new RecipeDetail(milk, 50.0),
                new RecipeDetail(sugar, 30.0)));

        ensureRecipe(user, mojito, List.of(
                new RecipeDetail(lemon, 1.0),
                new RecipeDetail(water, 200.0),
                new RecipeDetail(sugar, 20.0)));

        ensureRecipe(user, coldCoffee, List.of(
                new RecipeDetail(coffeeBeans, 20.0),
                new RecipeDetail(milk, 200.0),
                new RecipeDetail(sugar, 15.0)));

        // 4. Tables
        seedTables(user);
    }

    private Ingredient createIngredient(User user, String name, Double qty, String unit, Double threshold) {
        return ingredientRepository.save(new Ingredient(null, name, qty, unit, threshold, user));
    }

    private MenuItem createMenuItem(User user, String name, Double price, String category, String imageUrl) {
        return menuItemRepository.save(MenuItem.builder()
                .name(name)
                .price(price)
                .category(category)
                .available(true)
                .imageUrl(imageUrl)
                .user(user)
                .build());
    }

    private void ensureRecipe(User user, MenuItem item, List<RecipeDetail> details) {
        Recipe recipe = new Recipe();
        recipe.setMenuItem(item);
        recipe.setUser(user);
        recipeRepository.save(recipe);

        for (RecipeDetail detail : details) {
            RecipeIngredient ri = new RecipeIngredient();
            ri.setRecipe(recipe);
            ri.setIngredient(detail.ingredient);
            ri.setQuantity(detail.quantity);
            recipeIngredientRepository.save(ri);
        }
    }

    private static class RecipeDetail {
        Ingredient ingredient;
        Double quantity;

        public RecipeDetail(Ingredient ingredient, Double quantity) {
            this.ingredient = ingredient;
            this.quantity = quantity;
        }
    }

    private void seedTables(User user) {
        tableRepository.save(new Table(null, "1", 4, Table.TableStatus.OCCUPIED, 0.0, user));
        tableRepository.save(new Table(null, "2", 2, Table.TableStatus.FREE, 0.0, user));
        tableRepository.save(new Table(null, "3", 6, Table.TableStatus.RESERVED, 0.0, user));
        tableRepository.save(new Table(null, "4", 4, Table.TableStatus.OCCUPIED, 0.0, user));
        tableRepository.save(new Table(null, "5", 2, Table.TableStatus.FREE, 0.0, user));
        tableRepository.save(new Table(null, "6", 8, Table.TableStatus.OCCUPIED, 0.0, user));
        tableRepository.save(new Table(null, "7", 4, Table.TableStatus.FREE, 0.0, user));
        tableRepository.save(new Table(null, "8", 2, Table.TableStatus.RESERVED, 0.0, user));
        tableRepository.save(new Table(null, "9", 4, Table.TableStatus.FREE, 0.0, user));
        tableRepository.save(new Table(null, "10", 6, Table.TableStatus.OCCUPIED, 0.0, user));
        tableRepository.save(new Table(null, "11", 2, Table.TableStatus.FREE, 0.0, user));
        tableRepository.save(new Table(null, "12", 4, Table.TableStatus.FREE, 0.0, user));
    }
}
