export const log = async (resolve, parent, args, context, info) => {
  try {
    const res = await resolve();

    return res;
  } catch (error) {
    console.log(error);
  }
};