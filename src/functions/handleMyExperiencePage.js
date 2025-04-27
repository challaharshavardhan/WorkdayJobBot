async function handleMyExperiencePage(page, profile) {
    const jobTitleInput = page.locator('[data-automation-id="formField-jobTitle"] input').first();
  const currentJobTitle = await jobTitleInput.inputValue();
  
  if (currentJobTitle.trim() !== '') {
    console.log("✅ 'First Experience Job Title' already filled. Skipping Experience Page.");
    const saveAndContinueBtn = page.locator('[data-automation-id="pageFooterNextButton"]');
    await saveAndContinueBtn.click();
    console.log('✅ Clicked "Save and Continue"');
    return;
  }

  console.log("📝 'Job Title' empty. Filling Experience Page...");
    // Code for handling the 'My Experience' page actions
    console.log("I need to design experience page!!");
    // async function handleMyExperiencePage(page, profile) {
      const experiences = profile.experience;
      console.log("no of exp:"+experiences.length);
      // Scope to the Work Experience section only
      const experienceGroup = page.locator('[role="group"][aria-labelledby="Work-Experience-section"]');
    
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
    
        // If it's not the first experience, click the scoped Add button
        if (i > 0) {
          // await experienceGroup.getByRole('button', { name: 'Add Another' }).click();
          console.log("i am in");
          // const addBtn = experienceGroup.locator('[data-automation-id="add-button"]');
          // await addBtn.first().click({force: true});
          const addExperienceButton = experienceGroup.locator('[data-automation-id="add-button"]', { hasText: 'Add Another' });
          await addExperienceButton.click();
          await page.waitForTimeout(500);
          // await page.waitForTimeout(500); // small wait for fields to render
        }
    
        // Use `nth(i)` to target the right instance of each input
        const jobTitleInput = page.locator('[data-automation-id="formField-jobTitle"] input').nth(i);
        const companyInput = page.locator('[data-automation-id="formField-companyName"] input').nth(i);
        const locationInput = page.locator('[data-automation-id="formField-location"] input').nth(i);
        const startMonthInput = page.locator('[data-automation-id="dateSectionMonth-input"]').nth(i * 2);
        const startYearInput = page.locator('[data-automation-id="dateSectionYear-input"]').nth(i * 2);
        const endMonthInput = page.locator('[data-automation-id="dateSectionMonth-input"]').nth(i * 2 + 1);
        const endYearInput = page.locator('[data-automation-id="dateSectionYear-input"]').nth(i * 2 + 1);

        const descriptionTextarea = page.locator('[data-automation-id="formField-roleDescription"] textarea').nth(i);
    
        // Fill fields
        await jobTitleInput.fill(exp.jobTitle || '');
        await companyInput.fill(exp.companyName || '');
        await locationInput.fill(exp.location || '');
    
        // const start = exp.startDate || `${exp.from?.month || ''} ${exp.from?.year || ''}`;
        // const end = exp.endDate || `${exp.to?.month || ''} ${exp.to?.year || ''}`;
        await startMonthInput.fill(exp.startDate?.split('/')[0] || exp.from?.month || '');
        await startYearInput.fill(exp.startDate?.split('/')[1] || exp.from?.year || '');
        await endMonthInput.fill(exp.endDate?.split('/')[0] || exp.to?.month || '');
        await endYearInput.fill(exp.endDate?.split('/')[1] || exp.to?.year || '');

    
        if (exp.description?.length) {
          await descriptionTextarea.fill(exp.description.join('\n'));
        }
      }

      await page.locator('[data-automation-id="formField-schoolName"] input').fill('Georgia State University');

      const degreeDropdown = page.locator('button[name="degree"]'); // or use [id^="education-"][id$="--degree"]
      await degreeDropdown.click();
      await page.waitForSelector('[role="listbox"]'); // wait for dropdown to show
      
      const mastersOption = page.getByRole('option', { name: /Master's Degree/i });
      await mastersOption.click();
      


      const searchInput = page.locator('input[placeholder="Search"]');
      await searchInput.fill('Computer and Information Science');
      // await page.waitForTimeout(800); // Let the options load
      await searchInput.press('Enter');
      // await dropdownInput.press('Enter');
      console.log('✅ Selected Computer and Information Science');


      const uploadedFileLabel = page.locator('[data-automation-id="attachment-title"]'); // This selector may need tweaking based on exact markup

if (await uploadedFileLabel.count() > 0) {
  const fileName = await uploadedFileLabel.first().innerText();
  if (fileName && fileName.toLowerCase().includes('resume')) {
    console.log(`📄 Resume already uploaded (${fileName}) — skipping upload.`);
  } else {
    console.log(`📄 Attachment found, but doesn't look like resume (${fileName}) — uploading anyway...`);
    await uploadResume();
  }
} else {
  await uploadResume();
}

// Resume upload logic extracted to a function
async function uploadResume() {
  const fileInput = page.locator('input[type="file"]');

  if (await fileInput.count() > 0) {
    console.log('📂 File input found — setting resume without clicking anything...');
    await fileInput.setInputFiles(profile.resumePath);
    console.log('✅ Resume uploaded successfully.');
  } else {
    const uploadIcon = page.locator('.wd-accent-arrow-up-circle.wd-accent');
    if (await uploadIcon.isVisible()) {
      console.log('📄 Upload icon visible — clicking to reveal file input...');
      await uploadIcon.click();
      await page.waitForTimeout(1000); // allow time for input to render

      const revealedInput = page.locator('input[type="file"]');
      await revealedInput.waitFor({ state: 'attached', timeout: 5000 });

      try {
        await revealedInput.setInputFiles(profile.resumePath);
        console.log('✅ Resume uploaded after clicking icon.');
      } catch (err) {
        console.error("❌ Error while uploading resume:", err);
      }
    } else {
      console.warn("⚠️ No file input or upload icon found — cannot upload resume.");
    }
  }
}


    // console.log("after resume!");
    try {
      const URLGroup = page.locator('[role="group"][aria-labelledby="Websites-section"]');
      const addButton = URLGroup.locator('[data-automation-id="add-button"]');
      const urlsToAdd = [profile.github, profile.linkedin, profile.leetcode];
    
      await addButton.waitFor({ state: 'visible', timeout: 50000 });
    
      for (let i = 0; i < urlsToAdd.length; i++) {
        const urlInputs = page.locator('[data-automation-id="formField-url"] input');
        const inputCount = await urlInputs.count();
    
        // Check if input at position i already exists
        if (inputCount > i) {
          const existingValue = await urlInputs.nth(i).inputValue();
          if (existingValue.trim() !== '') {
            console.log('✅ URL at index ${i} already filled (${existingValue}). Skipping.');
            continue; // Skip to next URL
          }
        } else {
          // Input field not yet created, so click Add Another
          await addButton.click({ force: true });
          await page.waitForTimeout(1000); // small wait for new input to appear
        }
    
        // After ensuring input exists, fill it
        await urlInputs.nth(i).waitFor({ state: 'visible', timeout: 30000 });
        await urlInputs.nth(i).fill(urlsToAdd[i]);
        console.log('🔗 Filled URL at index ${i}: ${urlsToAdd[i]}');
      }
    
      const saveAndContinueBtn = page.locator('[data-automation-id="pageFooterNextButton"]');
      await saveAndContinueBtn.click();
      console.log('✅ Clicked "Save and Continue"');
      console.log("✅ All URLs handled successfully.");
      
    } catch (err) {
      console.error("❌ Error during URL addition:", err);
    }
    
    }
    module.exports={handleMyExperiencePage};