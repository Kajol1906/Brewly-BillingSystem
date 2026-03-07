package com.brewly.brewly_backend;

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
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final IngredientRepository ingredientRepository;
        private final MenuItemRepository menuItemRepository;
        private final RecipeRepository recipeRepository;
        private final RecipeIngredientRepository recipeIngredientRepository;
        private final TableRepository tableRepository;
        private final JdbcTemplate jdbcTemplate;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                // Drop Hibernate-generated enum CHECK constraint so any category string is allowed
                try {
                        jdbcTemplate.execute("ALTER TABLE menu_item DROP CONSTRAINT IF EXISTS menu_item_category_check");
                } catch (Exception e) {
                        System.out.println("No category check constraint to drop (OK)");
                }

                // Reset any stuck RESERVED tables to FREE (reservations are now dynamic)
                try {
                        jdbcTemplate.execute(
                                        "UPDATE restaurant_tables SET status = 'FREE' WHERE status = 'RESERVED'");
                        System.out.println("✅ Cleaned up stuck RESERVED tables");
                } catch (Exception e) {
                        System.out.println("No stuck RESERVED tables to clean up (OK)");
                }

                System.out.println("🌱 Seeding data...");

                // 1. Ingredients (Find or Create)
                Ingredient coffeeBeans = findOrCreateIngredient("Coffee Beans", 10000.0, "g", 500.0);
                Ingredient milk = findOrCreateIngredient("Milk", 5000.0, "ml", 100.0);
                Ingredient sugar = findOrCreateIngredient("Sugar", 5000.0, "g", 500.0);
                Ingredient water = findOrCreateIngredient("Water", 10000.0, "ml", 1000.0);
                Ingredient teaLeaves = findOrCreateIngredient("Tea Leaves", 2000.0, "g", 200.0);
                Ingredient flour = findOrCreateIngredient("Flour", 5000.0, "g", 500.0);
                Ingredient butter = findOrCreateIngredient("Butter", 2000.0, "g", 200.0);

                // 2. Menu Items (Find or Create)
                MenuItem cappuccino = findOrCreateMenuItem("Cappuccino", 120.0, "COFFEE",
                                "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem latte = findOrCreateMenuItem("Latte", 130.0, "COFFEE",
                                "https://images.unsplash.com/photo-1570968992193-6e584a3921b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem espresso = findOrCreateMenuItem("Espresso", 90.0, "COFFEE",
                                "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem croissant = findOrCreateMenuItem("Croissant", 80.0, "SNACKS",
                                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // 3. Recipes (Ensure they exist)
                ensureRecipe(cappuccino, List.of(
                                new RecipeDetail(coffeeBeans, 20.0),
                                new RecipeDetail(milk, 150.0),
                                new RecipeDetail(sugar, 10.0)));

                ensureRecipe(latte, List.of(
                                new RecipeDetail(coffeeBeans, 20.0),
                                new RecipeDetail(milk, 200.0),
                                new RecipeDetail(sugar, 10.0)));

                ensureRecipe(espresso, List.of(
                                new RecipeDetail(coffeeBeans, 20.0),
                                new RecipeDetail(water, 30.0)));

                ensureRecipe(croissant, List.of(
                                new RecipeDetail(flour, 50.0),
                                new RecipeDetail(butter, 30.0),
                                new RecipeDetail(sugar, 5.0)));

                // Add missing items that users might be seeing
                MenuItem vegBurger = findOrCreateMenuItem("Veg Burger", 99.0, "SNACKS",
                                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                MenuItem burger = findOrCreateMenuItem("Burger", 149.0, "SNACKS",
                                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                MenuItem periPeriFries = findOrCreateMenuItem("Peri Peri Fries", 120.0, "SNACKS",
                                "https://images.unsplash.com/photo-1573080496982-b9418af17fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // Ingredient needed
                Ingredient potato = findOrCreateIngredient("Potato", 5000.0, "g", 500.0);
                Ingredient bread = findOrCreateIngredient("Bread Bun", 50.0, "pcs", 5.0);
                Ingredient patty = findOrCreateIngredient("Veg Patty", 50.0, "pcs", 5.0);
                Ingredient spices = findOrCreateIngredient("Spices", 1000.0, "g", 100.0);

                ensureRecipe(vegBurger, List.of(
                                new RecipeDetail(bread, 1.0),
                                new RecipeDetail(patty, 1.0),
                                new RecipeDetail(spices, 5.0)));

                ensureRecipe(burger, List.of(
                                new RecipeDetail(bread, 1.0),
                                new RecipeDetail(patty, 1.0),
                                new RecipeDetail(spices, 5.0)));

                ensureRecipe(periPeriFries, List.of(
                                new RecipeDetail(potato, 200.0),
                                new RecipeDetail(spices, 10.0)));

                // Additional mock data for other categories
                MenuItem masalaTea = findOrCreateMenuItem("Masala Tea", 60.0, "TEA",
                                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem icedTea = findOrCreateMenuItem("Iced Lemon Tea", 110.0, "TEA",
                                "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                MenuItem chocBrownie = findOrCreateMenuItem("Chocolate Brownie", 150.0, "DESSERT",
                                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem cheesecake = findOrCreateMenuItem("New York Cheesecake", 220.0, "DESSERT",
                                "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                MenuItem mojito = findOrCreateMenuItem("Virgin Mojito", 140.0, "BEVERAGES",
                                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                MenuItem coldCoffee = findOrCreateMenuItem("Cold Coffee", 160.0, "BEVERAGES",
                                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // Ensure recipes for new items
                Ingredient lemon = findOrCreateIngredient("Lemon", 50.0, "pcs", 10.0);
                Ingredient chocolate = findOrCreateIngredient("Chocolate", 2000.0, "g", 500.0);

                ensureRecipe(masalaTea, List.of(
                                new RecipeDetail(teaLeaves, 10.0),
                                new RecipeDetail(milk, 50.0),
                                new RecipeDetail(water, 100.0),
                                new RecipeDetail(sugar, 10.0)));

                ensureRecipe(icedTea, List.of(
                                new RecipeDetail(teaLeaves, 15.0),
                                new RecipeDetail(lemon, 0.5),
                                new RecipeDetail(water, 200.0),
                                new RecipeDetail(sugar, 15.0)));

                ensureRecipe(chocBrownie, List.of(
                                new RecipeDetail(flour, 50.0),
                                new RecipeDetail(chocolate, 30.0),
                                new RecipeDetail(butter, 20.0),
                                new RecipeDetail(sugar, 40.0)));

                ensureRecipe(cheesecake, List.of(
                                new RecipeDetail(milk, 50.0),
                                new RecipeDetail(sugar, 30.0)));

                ensureRecipe(mojito, List.of(
                                new RecipeDetail(lemon, 1.0),
                                new RecipeDetail(water, 200.0),
                                new RecipeDetail(sugar, 20.0)));

                ensureRecipe(coldCoffee, List.of(
                                new RecipeDetail(coffeeBeans, 20.0),
                                new RecipeDetail(milk, 200.0),
                                new RecipeDetail(sugar, 15.0)));

                // 4. Tables
                seedTables();

                System.out.println("✅ Data seeded successfully!");
        }

        private Ingredient findOrCreateIngredient(String name, Double qty, String unit, Double threshold) {
                return ingredientRepository.findAll().stream()
                                .filter(i -> i.getName().equalsIgnoreCase(name))
                                .findFirst()
                                .orElseGet(() -> ingredientRepository
                                                .save(new Ingredient(null, name, qty, unit, threshold)));
        }

        private MenuItem findOrCreateMenuItem(String name, Double price, String category, String imageUrl) {
                return menuItemRepository.findAll().stream()
                                .filter(m -> m.getName().equalsIgnoreCase(name))
                                .findFirst()
                                .orElseGet(() -> menuItemRepository.save(MenuItem.builder()
                                                .name(name)
                                                .price(price)
                                                .category(category)
                                                .available(true)
                                                .imageUrl(imageUrl)
                                                .build()));
        }

        private void ensureRecipe(MenuItem item, List<RecipeDetail> details) {
                if (recipeRepository.findAll().stream().anyMatch(r -> r.getMenuItem().getId().equals(item.getId()))) {
                        return; // Recipe already exists
                }

                Recipe recipe = new Recipe();
                recipe.setMenuItem(item);
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

        private void seedTables() {
                if (tableRepository.count() == 0) {
                        // Create 12 tables as per the frontend mock data
                        tableRepository.save(new Table(null, "1", 4, Table.TableStatus.OCCUPIED, 0.0));
                        tableRepository.save(new Table(null, "2", 2, Table.TableStatus.FREE, 0.0));
                        tableRepository.save(new Table(null, "3", 6, Table.TableStatus.RESERVED, 0.0));
                        tableRepository.save(new Table(null, "4", 4, Table.TableStatus.OCCUPIED, 0.0));
                        tableRepository.save(new Table(null, "5", 2, Table.TableStatus.FREE, 0.0));
                        tableRepository.save(new Table(null, "6", 8, Table.TableStatus.OCCUPIED, 0.0));
                        tableRepository.save(new Table(null, "7", 4, Table.TableStatus.FREE, 0.0));
                        tableRepository.save(new Table(null, "8", 2, Table.TableStatus.RESERVED, 0.0));
                        tableRepository.save(new Table(null, "9", 4, Table.TableStatus.FREE, 0.0));
                        tableRepository.save(new Table(null, "10", 6, Table.TableStatus.OCCUPIED, 0.0));
                        tableRepository.save(new Table(null, "11", 2, Table.TableStatus.FREE, 0.0));
                        tableRepository.save(new Table(null, "12", 4, Table.TableStatus.FREE, 0.0));
                        System.out.println("🪑 Tables seeded!");
                }
        }
}
