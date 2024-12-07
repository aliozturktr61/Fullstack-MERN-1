import React, { useState } from "react";
import FileBase64 from "react-file-base64";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { TextField, Select, Input, MenuItem, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updatePost } from "../redux/actions/post";

// Styled Components
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const tags = ["fun", "programming", "health", "science"];

const postSchema = yup.object().shape({
  title: yup.string().required("Başlık zorunlu alan"),
  subtitle: yup.string().required("Alt başlık zorunlu alan"),
  content: yup.string().min(20, "İçerik en az 20 karakter olmalı").required(),
  tag: yup.mixed().oneOf(tags).required(),
});

const EditPostForm = ({ post, closeEditMode }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(post?.image);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(postSchema),
  });

  const onSubmit = (data) => {
    const updatedPost = {
      _id: post._id,
      ...data,
      image: file,
    };
    dispatch(updatePost(post._id, updatedPost));

    reset();
    setFile(null);
    closeEditMode();
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <StyledTextField
          id="title"
          label="Başlık"
          variant="outlined"
          size="small"
          fullWidth
          defaultValue={post?.title}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <StyledTextField
          id="subtitle"
          label="Alt Başlık"
          variant="outlined"
          size="small"
          fullWidth
          defaultValue={post?.subtitle}
          error={!!errors.subtitle}
          helperText={errors.subtitle?.message}
        />
        <Controller
          name="tag"
          control={control}
          render={({ field }) => (
            <StyledSelect
              {...field}
              input={<Input />}
              variant="outlined"
              fullWidth
              defaultValue={post?.tag}
            >
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </StyledSelect>
          )}
        />
        <StyledTextField
          id="content"
          label="İçerik"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          defaultValue={post?.content}
          error={!!errors.content}
          helperText={errors.content?.message}
        />
        <Box mt={2}>
          <FileBase64
            multiple={false}
            onDone={({ base64 }) => setFile(base64)}
          />
        </Box>
        <Box mt={2}>
          <StyledButton color="primary" variant="outlined" onClick={closeEditMode}>
            Vazgeç
          </StyledButton>
          <StyledButton
            color="secondary"
            variant="outlined"
            type="submit"
            sx={{ ml: 2 }}
          >
            Kaydet
          </StyledButton>
        </Box>
      </Box>
    </form>
  );
};

export default EditPostForm;