/**
 * End-to-End Workflow Test for GramKart
 * Tests: Retailer signup -> shop creation -> inventory add -> Buyer signup -> product search
 */

const BASE_URL = 'http://localhost:7000/api';

async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + endpoint, options);
  const data = await res.json();

  return { status: res.status, ok: res.ok, data };
}

async function runTest() {
  console.log('\n=== GramKart End-to-End Workflow Test ===\n');

  try {
    // Step 1: Retailer Signup
    console.log('Step 1: Retailer Signup');
    const retailerSignup = await makeRequest('/auth/signup', 'POST', {
      name: 'Test Retailer',
      phone: '9000000001',
      password: 'password123',
      role: 'retailer'
    });
    console.log(`Status: ${retailerSignup.status}`);
    if (!retailerSignup.ok) {
      console.log(`Error: ${retailerSignup.data.message}`);
      return;
    }
    const retailerToken = retailerSignup.data.token;
    console.log(`✓ Retailer signed up. Token: ${retailerToken.substring(0, 20)}...`);

    // Step 2: Create Shop
    console.log('\nStep 2: Create Shop');
    const createShop = await makeRequest('/shop/create', 'POST', {
      shopName: 'Test Shop ' + Date.now(),
      address: 'Test Address',
      contact: '9876543210'
    }, retailerToken);
    console.log(`Status: ${createShop.status}`);
    if (!createShop.ok) {
      console.log(`Error: ${createShop.data.message}`);
      return;
    }
    const shopId = createShop.data.shop._id;
    console.log(`✓ Shop created. ID: ${shopId}`);

    // Step 3: Add Product to Inventory
    console.log('\nStep 3: Add Product to Inventory');
    const productName = 'Rice ' + Date.now();
    const addInventory = await makeRequest('/inventory/add', 'POST', {
      productName: productName,
      category: 'Grains',
      unit: 'kg',
      price: 50,
      stock: 100
    }, retailerToken);
    console.log(`Status: ${addInventory.status}`);
    if (!addInventory.ok) {
      console.log(`Error: ${addInventory.data.message}`);
      return;
    }
    const inventoryId = addInventory.data.inventory._id;
    const productId = addInventory.data.inventory.product;
    console.log(`✓ Product added to inventory. Inventory ID: ${inventoryId}`);
    console.log(`  Product: ${productName}, Price: ₹${addInventory.data.inventory.price}, Stock: ${addInventory.data.inventory.stock}`);

    // Step 4: Verify Inventory Appears in Retailer's List
    console.log('\nStep 4: Get Retailer\'s Inventory');
    const myInventory = await makeRequest('/inventory/my', 'GET', null, retailerToken);
    console.log(`Status: ${myInventory.status}`);
    if (!myInventory.ok) {
      console.log(`Error: ${myInventory.data.message}`);
      return;
    }
    console.log(`✓ Inventory retrieved. Count: ${myInventory.data.length}`);
    myInventory.data.forEach(item => {
      console.log(`  - ${item.product.name}: ₹${item.price}, Stock: ${item.stock}`);
    });

    // Step 5: Buyer Signup
    console.log('\nStep 5: Buyer Signup');
    const buyerSignup = await makeRequest('/auth/signup', 'POST', {
      name: 'Test Buyer',
      phone: '8000000001',
      password: 'password123',
      role: 'buyer'
    });
    console.log(`Status: ${buyerSignup.status}`);
    if (!buyerSignup.ok) {
      console.log(`Error: ${buyerSignup.data.message}`);
      return;
    }
    const buyerToken = buyerSignup.data.token;
    console.log(`✓ Buyer signed up. Token: ${buyerToken.substring(0, 20)}...`);

    // Step 6: Buyer Searches for Product
    console.log(`\nStep 6: Buyer Searches for Product: "${productName.split(' ')[0]}"`);
    const searchProducts = await makeRequest(`/buyer/products/search?name=${productName.split(' ')[0]}`, 'GET', null, buyerToken);
    console.log(`Status: ${searchProducts.status}`);
    if (!searchProducts.ok) {
      console.log(`Error: ${searchProducts.data.message}`);
      return;
    }
    console.log(`✓ Search completed. Found: ${searchProducts.data.length} product(s)`);
    searchProducts.data.forEach(product => {
      console.log(`  - ${product.name} (${product.category}, ${product.unit})`);
    });

    // Step 7: Check Product Availability
    console.log(`\nStep 7: Check Product Availability`);
    if (searchProducts.data.length > 0) {
      const prodId = searchProducts.data[0]._id;
      const availability = await makeRequest(`/buyer/products/${prodId}/availability`, 'GET', null, buyerToken);
      console.log(`Status: ${availability.status}`);
      if (!availability.ok) {
        console.log(`Error: ${availability.data.message}`);
        return;
      }
      console.log(`✓ Availability checked. Shops: ${availability.data.length}`);
      availability.data.forEach(item => {
        console.log(`  - ${item.shop.shopName}: ₹${item.price}, Stock: ${item.stock}`);
      });
    }

    // Step 8: View Shop Inventory
    console.log(`\nStep 8: Buyer Views Shop Inventory (ID: ${shopId})`);
    const shopInventory = await makeRequest(`/buyer/shops/${shopId}/inventory`, 'GET', null, buyerToken);
    console.log(`Status: ${shopInventory.status}`);
    if (!shopInventory.ok) {
      console.log(`Error: ${shopInventory.data.message}`);
      return;
    }
    console.log(`✓ Shop inventory retrieved. Products: ${shopInventory.data.length}`);
    shopInventory.data.forEach(item => {
      console.log(`  - ${item.product.name}: ₹${item.price}, Stock: ${item.stock}`);
    });

    console.log('\n=== ✓ ALL TESTS PASSED ===\n');

  } catch (error) {
    console.error('\n✗ Test Failed:', error.message);
  }
}

// Run the test
runTest();
