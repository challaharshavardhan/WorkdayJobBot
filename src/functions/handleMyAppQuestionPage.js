async function handleMyAppQuestionPage(page, questionAnswerPairs) {
    console.log("we need to work on questions!");
console.log("📝 First question empty. Answering Application Questions...");
      for (const { question, answer } of questionAnswerPairs) {
        try {
          console.log(`➡️ Answering question: "${question}" with "${answer}"`);
    
          const normalizedQuestion = question.replace(/\s+/g, ' ').trim().toLowerCase();
          const fieldsets = page.locator('fieldset');
          const count = await fieldsets.count();
          let matched = false;
    
          for (let i = 0; i < count; i++) {
            const fieldset = fieldsets.nth(i);
            const legendText = await fieldset.locator('legend').innerText().catch(() => '');
    
            const normalizedLegend = legendText.replace(/\s+/g, ' ').trim().toLowerCase();
    
            if (normalizedLegend.includes(normalizedQuestion)) {
              matched = true;
    
              const dropdownButton = fieldset.locator('button');
              if (await dropdownButton.isDisabled()) {
                console.warn(`⚠️ Dropdown is disabled for question "${question}". Skipping.`);
                break;
              }
    
              await dropdownButton.waitFor({ state: 'visible', timeout: 500 });
              await dropdownButton.click();
    
              // ➡️ NEW: Locate <li role="option"> and check its inner div
              const optionsList = page.locator('li[role="option"]');
    
              await optionsList.first().waitFor({ state: 'visible', timeout: 500 });
    
              const countOptions = await optionsList.count();
              let found = false;
              for (let j = 0; j < countOptions; j++) {
                const option = optionsList.nth(j);
                const divText = await option.locator('div').innerText().catch(() => '');
    
                if (divText.trim().toLowerCase() === answer.trim().toLowerCase()) {
                  await option.click();
                  console.log(`✅ Selected "${answer}" for question "${question}"`);
                  found = true;
                  break;
                }
              }
    
              if (!found) {
                console.warn(`⚠️ Option "${answer}" not found for question "${question}". Selecting first available option instead.`);
                await optionsList.first().click();
              }
    
              break; // Done with this question
            }
          }
    
          if (!matched) {
            console.warn(`⚠️ No matching fieldset found for question "${question}"`);
          }
        } catch (error) {
          console.error(`❌ Failed to answer question "${question}":`, error);
        }
        // return;
      }
    }
    module.exports={handleMyAppQuestionPage};