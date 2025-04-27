// Code for handling the 'My Information' page actions
async function handleMyInformationPage(page,profile) {
    //for source i.e dropdown (how did you hear abt us)
    await page.locator('#source--source').click(); // Open dropdown
    await page.locator('[role="listbox"] >> [role="option"]').nth(2).click(); 

    //for yes or no (previously worked)
    await page.locator('#previousWorker--candidateIsPreviousWorker').getByLabel('No').check();

    // Step 1: Get the current value of the button
  const countryButton = page.locator('#country--country');
  const currentCountry = await countryButton.innerText();
  // Step 2: If it's not already "United States of America", update it
  if (currentCountry.trim() !== 'United States of America') {
    console.log(`🌍 Changing country from "${currentCountry}" to "United States of America"`);

    // Click the dropdown to show the list
    await countryButton.click();

    // Wait for the listbox to appear
    await page.waitForSelector('[role="listbox"]');

    // Click the desired country option from the dropdown
    await page.locator('[role="listbox"] >> text="United States of America"').nth(0).click();

    console.log(`✅ Country selected: United States of America`);
  } else {
    console.log(`✅ Country already set to United States of America — no change needed.`);
  }
  const firstNameInput = page.locator('#name--legalName--firstName');
  await firstNameInput.fill(''); // clears the field
  await firstNameInput.fill('Harsha Vardhan'); // fills with new value

  const lastNameInput = page.locator('#name--legalName--lastName');
  await lastNameInput.fill(''); // clears the field
  await lastNameInput.fill('Challa'); // fills with new value

  const addressLine1 = page.locator('#address--addressLine1');
  await addressLine1.fill(''); // clears the field
  await addressLine1.fill('2450 Camellia Lane NE'); // fills with new value

  const addressLine2 = page.locator('#address--addressLine2');
  await addressLine2.fill(''); // clears the field
  await addressLine2.fill('APT-1200'); // fills with new value

  const city = page.locator('#address--city');
  await city.fill(''); // clears the field
  await city.fill('Atlanta'); // fills with new value

    // Step 1: Get the current value of the button
    const stateButton = page.locator('#address--countryRegion');
  const currState = await stateButton.innerText();

  if (currState.trim() !== 'Georgia') {
    console.log(`🌍 Changing state from "${currState}" to "Georgia"`);

    // Click the dropdown
    await stateButton.click();

    // Find all listboxes, and get the most recent one
    const listboxes = page.locator('[role="listbox"]');
    const count = await listboxes.count();

    // Assume the last one is the one just opened
    await listboxes.nth(count - 1).locator('text=Georgia').click();

    console.log(`✅ State selected: Georgia`);
  } else {
    console.log(`✅ State already set to Georgia — no change needed.`);
  }

  const postCode = page.locator('#address--postalCode');
  await postCode.fill(''); // clears the field
  await postCode.fill('30324'); // fills with new value



    // Step 1: Get the current value of the button
    const phoneType = page.locator('#phoneNumber--phoneType');
  const currPhone = await phoneType.innerText();

  if (currPhone.trim() !== 'Mobile') {
    console.log(`🌍 Changing Device from "${currPhone}" to "Mobile"`);

    // Click the dropdown
    await phoneType.click();

    // Find all listboxes, and get the most recent one
    const listboxes = page.locator('[role="listbox"]');
    const count = await listboxes.count();
    console.log("no of dropdowns:"+count);

    // Assume the last one is the one just opened
    await listboxes.nth(count - 1).locator('text=Mobile').click();

    console.log(`✅ Device selected: Mobile`);
  } else {
    console.log(`✅ Device already set to Mobile — no change needed.`);
  }


    // Step 1: Remove the existing selected country (if any)
    const deleteBtn = page.locator('[data-automation-id="DELETE_charm"]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      console.log('🧹 Cleared existing phone country code');
    }
    // Step 2: Focus the input to trigger the dropdown
    const dropdownInput = page.locator('#phoneNumber--countryPhoneCode');
    await dropdownInput.click({ force: true });
    // Step 3: Fill search input
    const searchInput = page.locator('input[placeholder="Search"]');
    await searchInput.fill('United States of America (+1)');
    await page.waitForTimeout(800); // Let the options load
    await dropdownInput.press('Enter');
    console.log('✅ Selected United States of America (+1)');

    const phoneNumber = page.locator('#phoneNumber--phoneNumber');
    await phoneNumber.fill(''); // clears the field
    await phoneNumber.fill('4709234458'); // fills with new value

    // Step 4: Wait for the "Save and Continue" button to be visible
    const saveAndContinueBtn = page.locator('[data-automation-id="pageFooterNextButton"]');
    // Step 5: Click the "Save and Continue" button
    await saveAndContinueBtn.click();
    console.log('✅ Clicked "Save and Continue"');
  }
  module.exports={handleMyInformationPage};