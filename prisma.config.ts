import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // කෙලින්ම URL එක මෙතනට දීලා බලන්න වැඩේ වෙනවද කියලා
    url: "postgresql://postgres:wasana25@localhost:5433/eshop_db?schema=public",
  },
});