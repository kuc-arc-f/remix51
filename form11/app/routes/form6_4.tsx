import { useActionData, Form } from "@remix-run/react";

export default function TodoPage() {
  const actionData = useActionData<{ errors?: any }>();

  return (
    <Form method="post">
      <div>
        <label>
          Title:
          <input type="text" name="title" />
          {actionData?.errors?.title && <p>{actionData.errors.title._errors}</p>}
        </label>
      </div>
      <div>
        <label>
          Content:
          <textarea name="content" />
          {actionData?.errors?.content && <p>{actionData.errors.content._errors}</p>}
        </label>
      </div>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={`qty${i}`}>
          <label>
            Qty{i}:
            <input type="text" name={`qty${i}`} />
            {actionData?.errors?.[`qty${i}`] && <p>{actionData.errors[`qty${i}`]._errors}</p>}
          </label>
        </div>
      ))}
      <button type="submit">Submit</button>
    </Form>
  );
}
