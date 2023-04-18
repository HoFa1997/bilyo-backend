export const responseGenerator = (id: string, text: string) => {
  return {
    id,
    message: text,
  };
};
